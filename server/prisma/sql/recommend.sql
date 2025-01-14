-- $1 = senderId
SELECT
    recv, 
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

ORDER BY overlap DESC
LIMIT $2 OFFSET $3;
