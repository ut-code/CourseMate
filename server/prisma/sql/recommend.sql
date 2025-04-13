-- $1 = senderId
SELECT
    recv.id,
    recv.name,
    recv.gender,
    recv.grade,
    recv.faculty,
    recv.department,
    recv.intro,
    recv."guid",
    recv."pictureUrl",
    json_agg(DISTINCT jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'teacher', c.teacher,
        'slots', (
          SELECT json_agg(
            jsonb_build_object(
              'courseId', "Slot"."courseId",
              'day', "Slot"."day",
              'period', "Slot"."period"
            )
          ) FROM "Slot" WHERE "Slot"."courseId" = c.id)
        )
      ) AS "courses",
    json_agg(DISTINCT jsonb_build_object(
        'id', s.id,
        'name', s.name,
        'group', s.group
      )) AS "interestSubjects",
    -- course overlap
    (SELECT COUNT(1) FROM "Course" course
        WHERE EXISTS (SELECT 1 FROM "Enrollment" e WHERE e."courseId" = course.id AND e."userId" = recv.id)
        AND EXISTS (SELECT 1 FROM "Enrollment" e WHERE e."courseId" = course.id AND e."userId" = $1)
    )
    + -- interest overlap
    (SELECT COUNT(1) FROM "InterestSubject" subj
        WHERE EXISTS (SELECT 1 FROM "Interest" i WHERE i."subjectId" = subj.id AND i."userId" = recv.id)
        AND EXISTS (SELECT 1 FROM "Interest" i WHERE i."subjectId" = subj.id AND i."userId" = $1)
    ) AS overlap
FROM "User" recv

INNER JOIN "Enrollment" ON "Enrollment"."userId" = recv.id
INNER JOIN "Course" c on c.id = "Enrollment"."courseId"
INNER JOIN "Slot" ON "Slot"."courseId" = c.id
INNER JOIN "Interest" ON "Interest"."userId" = recv.id
INNER JOIN "InterestSubject" s ON s.id = "Interest"."subjectId"

WHERE recv.id <> $1

AND NOT EXISTS (
    SELECT 1 FROM "Relationship" rel
    WHERE rel."sendingUserId" IN ($1, recv.id) AND rel."receivingUserId" IN ($1, recv.id)
    AND (status = 'MATCHED' OR status = 'REJECTED')
)

AND NOT EXISTS (
    SELECT 1 FROM  "Relationship" rel_pd
    WHERE rel_pd."sendingUserId" = $1 AND rel_pd."receivingUserId" = recv.id
    AND status = 'PENDING'
)

-- 授業の登録も興味分野の登録も 0 件のユーザは除外
AND (
  EXISTS (
    SELECT 1 FROM "Enrollment" e
    WHERE e."userId" = recv.id
  )
  OR
  EXISTS (
    SELECT 1 FROM "Interest" i
    WHERE i."userId" = recv.id
  )
)

GROUP BY recv.id

ORDER BY overlap DESC
LIMIT $2 OFFSET $3;
