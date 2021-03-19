const db = require('../models');

const searchAllBy = async options => {
    let whereSql = `WHERE 1 = 1`,
        whereSql1 = `WHERE 1 = 1`,
        limitSql = '';

    let bind = [], index = 0;
    const { userId } = options;
    if (userId) {
        index++;
        whereSql += ` AND a.voterId = $${index}`;
        // union select
        whereSql1 += ` AND d.userId = $${index}`;
        bind.push(userId);
    }

    const { keyword } = options;
    if (keyword) {
        index++;
        whereSql += ` AND (
            CONCAT(c.firstName, ' ', c.lastName) LIKE $${index} OR
            c.username LIKE $${index} OR
            b.name LIKE $${index}
        )`;

        // union select
        whereSql1 += ` AND (
            CONCAT(f.firstName, ' ', f.lastName) LIKE $${index} OR
            f.username LIKE $${index} OR
            e.name LIKE $${index}
        )`;
        bind.push(`%${keyword}%`);
    }

    // const { tags } = options;
    // if (tags) {
    //     if (tags.length > 0) {
    //         let subSql = `1 = 0`;
    //         tags.forEach(tag => {
    //             index++;
    //             subSql += ` OR (CONCAT(c.firstName, ' ', c.lastName) LIKE '%$${index}%' OR c.username LIKE '%$${index}%')`;
    //             bind.push(tag);
    //         });
    //         whereSql += ` AND (${subSql})`;
    //     }
    // }

    const { filterClient, clientName } = options;
    if (filterClient && clientName) {
        index++;
        whereSql += ` AND b.name = $${index}`;

        // union select
        whereSql1 += ` AND e.name = $${index}`;
        bind.push(clientName);
    }

    const { showGlobal } = options;

    const { sortBy, ascDesc } = options;
    if (sortBy && ascDesc) {
        limitSql += ` ORDER BY ${sortBy} ${ascDesc}, updatedAt, clientName`;
    } else {
        limitSql += ` ORDER BY updatedAt, clientName`;
    }

    let countSql = `
        SELECT
            SUM(totalCount) AS totalCount
        FROM (
            SELECT
                COUNT(*) AS totalCount
            FROM Votes a
            LEFT JOIN Clients b ON a.clientId = b.id
            LEFT JOIN Users c ON a.ownerId = c.id
            ${whereSql}
            UNION ALL SELECT
                COUNT(*) AS totalCount
            FROM
                Scores d
            LEFT JOIN Clients e ON d.clientId = e.id
            LEFT JOIN Users f ON d.userId = f.id
            ${whereSql1}
        ) a
    `;

    const { pageNum, pageSize } = options;
    if (pageNum > 0 && pageSize > 0) {
        const offset = (pageNum - 1) * pageSize;
        limitSql += ` LIMIT ${offset}, ${pageSize}`;
    }

    let sql = `
        SELECT
            IF (a.rating > 0, 'Upvote', 'Downvote') AS activity,
            a.clientId,
            b.name AS clientName,
            b.meritPoint,
            br1.value AS orgMeritPoint,
            bd.value AS orgWeight,
            br2.value AS evaluation,
            a.voterId AS userId,
            CONCAT( c.firstName, ' ', c.lastName ) AS fullName,
            a.rating,
            a.createdAt,
            a.updatedAt
        FROM Votes a
        LEFT JOIN Clients b ON a.clientId = b.id
        LEFT JOIN Users c ON a.ownerId = c.id
        LEFT JOIN BaseFields bf1 ON
            bf1.baseType = 10 AND ((
                bf1.fieldFrom IS NOT NULL AND
                bf1.fieldTo IS NOT NULL AND
                bf1.fieldFrom <= b.meritPoint AND
                bf1.fieldTo > b.meritPoint
            ) OR (
                bf1.fieldFrom IS NULL AND
                bf1.fieldTo IS NOT NULL AND
                bf1.fieldTo > b.meritPoint
            ) OR (
                bf1.fieldFrom IS NOT NULL AND
                bf1.fieldTo IS NULL AND
                bf1.fieldFrom <= b.meritPoint
            ))
        LEFT JOIN BaseDetails bd ON bd.baseType = 3 AND bd.code = 0
        LEFT JOIN BaseFields bf2 ON
            bf2.baseType = 20 AND ((
                bf2.fieldFrom IS NOT NULL AND
                bf2.fieldTo IS NOT NULL AND
                bf2.fieldFrom <= a.rating AND
                bf2.fieldTo > a.rating
            ) OR (
                bf2.fieldFrom IS NULL AND
                bf2.fieldTo IS NOT NULL AND
                bf2.fieldTo > a.rating
            ) OR (
                bf2.fieldFrom IS NOT NULL AND
                bf2.fieldTo IS NULL AND
                bf2.fieldFrom <= a.rating
            ))
        ${whereSql}
        UNION ALL SELECT
            d.key AS activity,
            d.clientId,
            e.name AS clientName,
            e.meritPoint,
            brr1.value AS orgMeritPoint,
            bdd.value AS orgWeight,
            brr2.value AS evaluation,
            d.userId,
            CONCAT(f.firstName, ' ', f.lastName ) AS fullName,
            (brr1.value * bdd.value * brr2.value) AS rating,
            d.createdAt,
            e.updatedAt
        FROM
            Scores d
        LEFT JOIN Clients e ON d.clientId = e.id
        LEFT JOIN Users f ON d.userId = f.id
        LEFT JOIN BaseFields bff1 ON
            bff1.baseType = 10 AND ((
                bff1.fieldFrom IS NOT NULL AND
                bff1.fieldTo IS NOT NULL AND
                bff1.fieldFrom <= e.meritPoint AND
                bff1.fieldTo > e.meritPoint
            ) OR (
                bff1.fieldFrom IS NULL AND
                bff1.fieldTo IS NOT NULL AND
                bff1.fieldTo > e.meritPoint
            ) OR (
                bff1.fieldFrom IS NOT NULL AND
                bff1.fieldTo IS NULL AND
                bff1.fieldFrom <= e.meritPoint
            ))
        LEFT JOIN BaseDetails bdd ON bdd.baseType = 3 AND bdd.code = 0
        LEFT JOIN BaseFields bff2 ON
            bff2.baseType = 20 AND ((
                bff2.fieldFrom IS NOT NULL AND
                bff2.fieldTo IS NOT NULL AND
                bff2.fieldFrom <= d.value AND ((
                    bff2.fieldTo = 100 AND bff2.fieldTo >= d.value
                ) OR (
                    bff2.fieldTo != 100 AND bff2.fieldTo > d.value
                ))
            ) OR (
                bff2.fieldFrom IS NULL AND
                bff2.fieldTo IS NOT NULL AND
                bff2.fieldTo > d.value
            ) OR (
                bff2.fieldFrom IS NOT NULL AND
                bff2.fieldTo IS NULL AND
                bff2.fieldFrom <= d.value
            ))
        ${whereSql1}
        ${limitSql}
    `;

    const ratings = await db.querySelect(sql, bind);
    const totalCount = await db.querySelect(countSql, bind, true);

    return { ratings, ...totalCount };
};

module.exports = {
    searchAllBy,
}