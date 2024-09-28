SELECT recv.id, COUNT(recv_enroll) AS overlap FROM "User" recv 
INNER JOIN "Enrollment" recv_enroll ON recv_enroll."userId" = recv.id
INNER JOIN "Course" course ON recv_enroll."courseId" = course.id
INNER JOIN "Enrollment" req_enroll ON req_enroll."courseId" = course.id
WHERE req_enroll."userId" = 6 -- $1
GROUP BY recv.id
ORDER BY overlap DESC; -- LIMIT $2 OFFSET $3;
