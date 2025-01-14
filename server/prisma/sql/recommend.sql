SELECT
    $1 AS senderId,
    recv, 
    (SELECT COUNT(1) FROM "Course" course
        WHERE EXISTS (SELECT 1 FROM "Enrollment" e WHERE e.userId = recv.id)
        AND EXISTS (SELECT 1 FROM "Enrollment" e WHERE e.userId = senderId)
    ) AS course_overlap,
    (SELECT COUNT(1) FROM "InterestSubject" subj
        WHERE EXISTS (SELECT 1 FROM "Interest" i WHERE i.userId = recv.id)
        AND EXISTS (SELECT 1 FROM "Interest" i WHERE i.userId = senderId)
    ) AS interest_overlap
FROM "User" recv
WHERE recv.id <> senderId

AND NOT EXISTS (
    SELECT 1 FROM "Relationship" rel
    WHERE rel."sendingUserId" IN (senderId, recv.id) AND rel."receivingUserId" IN (senderId, recv.id)
    AND (status = 'MATCHED' OR status = 'REJECTED')
)

AND NOT EXISTS (
    SELECT 1 FROM  "Relationship" rel_pd
    WHERE rel_pd."sendingUserId" = senderId AND rel_pd."receivingUserId" = recv.id
    AND status = 'PENDING'
)

ORDER BY course_overlap + interest_overlap DESC
LIMIT $2 OFFSET $3;
