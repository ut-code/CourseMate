SELECT recv.id, 
    (SELECT COUNT(*) FROM "Enrollment" recv_enroll 
    INNER JOIN "Enrollment" req_enroll
    ON recv_enroll."courseId" = req_enroll."courseId" 
    WHERE recv_enroll."userId" = recv.id
    AND req_enroll."userId" = $1)
AS overlap FROM "User" recv ORDER BY overlap DESC LIMIT $2 OFFSET $3;

-- SELECT recv.id AS recv, COUNT(recv_enroll) AS overlap FROM "User" recv
-- LEFT JOIN "Relationship" rel ON (rel."sendingUserId" = recv.id AND rel."receivingUserId" = $1) OR (rel."sendingUserId" = $1 AND rel."sendingUserId" = recv.id)
-- LEFT JOIN "Enrollment" recv_enroll ON recv_enroll."userId" = recv.id
-- INNER JOIN "Course" course ON recv_enroll."courseId" = course.id
-- INNER JOIN "Enrollment" req_enroll ON req_enroll."courseId" = course.id
-- WHERE req_enroll."userId" = $1 AND recv.id <> $1
-- AND rel.status != 'MATCHED'
-- GROUP BY recv.id
-- ORDER BY overlap DESC LIMIT $2 OFFSET $3;
