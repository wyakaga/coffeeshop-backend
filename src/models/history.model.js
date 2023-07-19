const db = require('../configs/postgre');

const getHistory = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT  hps.history_id , d.method, p.img, p.name, p.price, hps.product_id, s.name AS transaction_status, pr.display_name AS buyer_name
    FROM history_products_sizes hps
    JOIN history h  ON h.id = hps.history_id
    JOIN products p ON p.id = hps.product_id
    JOIN deliveries d ON d.id = h.delivery_id
    JOIN status s ON s.id = hps.status_id
    JOIN users u ON u.id = h.user_id
    JOIN profiles pr ON pr.user_id = u.id
    WHERE h.user_id = $1 AND hps.status_id <> 4 AND u.role_id <> 1`;

    const values = [userId];

    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getHistoryDetail = (params) => {
  //? Temporarily use profile id as params?
  return new Promise((resolve, reject) => {
    const sql = `SELECT p."name" AS "product_name", p."img" AS product_img, hps."subtotal" AS "price", d."method" AS "delivery_method"
		FROM history_products_sizes hps
		INNER JOIN history h ON h.id = hps.history_id
		INNER JOIN products p ON p.id = hps.product_id
		INNER JOIN deliveries d ON d.id = h.delivery_id
		WHERE p.id = $1`;
    const values = [params.historyId];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getModifiedHistory = (client, historyId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT u.email, pf.address , p."name" AS "product", s."name" AS "size", pr.code AS "promo", py.method AS "payment_method",
		st."name" AS "transaction_status", hps.qty, hps.subtotal
		FROM history_products_sizes hps
		INNER JOIN history h ON h.id = hps.history_id
		INNER JOIN products p ON p.id = hps.product_id
		INNER JOIN sizes s  ON s.id = hps.size_id
		INNER JOIN users u ON u.id = h.user_id
		INNER JOIN profiles pf ON pf.user_id = u.id
		INNER JOIN payment py ON py.id = h.payment_id
		INNER JOIN promos pr ON pr.id = h.promo_id
		INNER JOIN status st ON st.id = h.status_id
		WHERE h.id = $1`;
    const values = [historyId];
    client.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const insertHistory = (client, data, userId) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO history (user_id, status_id, promo_id, payment_id, delivery_id)
    VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const values = [
      userId,
      data.status_id,
      data.promo_id,
      data.payment_id,
      data.delivery_id,
    ];
    client.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const insertDetailHistory = (client, data, historyId) => {
  return new Promise((resolve, reject) => {
    const { products, status_id } = data;
    let sql = `INSERT INTO history_products_sizes (history_id, product_id, size_id, qty, subtotal, status_id) VALUES `;
    let values = [];
    products.forEach((product, i) => {
      const { product_id, size_id, qty, subtotal } = product;
      if (values.length) sql += ', ';
      sql += `($${1 + 6 * i}, $${2 + 6 * i}, $${3 + 6 * i}, $${4 + 6 * i}, $${
        5 + 6 * i
      }, $${6 + 6 * i})`;
      values.push(historyId, product_id, size_id, qty, subtotal, status_id);
    });
    console.log(sql);
    client.query(sql, values, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const updateHistory = (params, data) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE history SET status_id = $1 WHERE id = $2 RETURNING *`;
    const values = [data.status_id, params.historyId];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const checkHistory = (client, historyId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT COUNT(*) FROM history_products_sizes WHERE history_id = $1`;
    const values = [historyId];
    client.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const deleteHistory = (client, userId, historyId) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE history SET status_id = 4 WHERE user_id = $1 AND id = $2 RETURNING id`;
    const values = [userId, historyId];
    client.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const deleteAllDetailHistory = (client, historyId) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE history_products_sizes SET status_id = 4 WHERE history_id = $1 RETURNING *`;
    const values = [historyId];
    client.query(sql, values, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const deleteDetailHistory = (client, historyId, productId) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE history_products_sizes SET status_id = 4 WHERE history_id = $1 AND product_id = $2 RETURNING *`;
    const values = [historyId, productId];
    client.query(sql, values, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

//* admin

const getPendingTransaction = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT  hps.history_id , d.method, p.img, p.name, p.price, hps.product_id, hps.qty, hps.size_id, s.name AS transaction_status, pr.display_name AS buyer_name, pr.address, u.phone_number, u.email
    FROM history_products_sizes hps
    JOIN history h  ON h.id = hps.history_id
    JOIN products p ON p.id = hps.product_id
    JOIN deliveries d ON d.id = h.delivery_id
    JOIN status s ON s.id = h.status_id
    JOIN users u ON u.id = h.user_id
    JOIN profiles pr ON pr.user_id = u.id
    WHERE h.status_id = 1 AND u.role_id <> 1
		ORDER BY h.id ASC`;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const updateTransactionStatus = (client, historyId) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE history SET status_id = 3, updated_at = NOW() WHERE id = $1 RETURNING *`;

    const values = [historyId];

    client.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const updateTransactionStatusDetail = (client, historyId) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE history_products_sizes SET status_id = 3 WHERE history_id = $1 RETURNING *`;
    const values = [historyId];
    client.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getMonthlyReport = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT
				EXTRACT(YEAR FROM DATE_TRUNC('month', m.month_date)) AS year,
				EXTRACT(MONTH FROM DATE_TRUNC('month', m.month_date)) AS month,
				COALESCE(SUM(hps.subtotal), 0) AS total_sum
		FROM (
				SELECT generate_series(
						DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months'),
						DATE_TRUNC('month', CURRENT_DATE),
						'1 month'
				) AS month_date
		) AS m
		LEFT JOIN history h ON DATE_TRUNC('month', h.created_at) = m.month_date
		LEFT JOIN history_products_sizes hps ON h.id = hps.history_id
				AND h.created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
		LEFT JOIN status s ON h.status_id = s.id
		WHERE s.id <> 1 OR s.id IS NULL
		GROUP BY year, month
		ORDER BY year, month`;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getDailyTransactions = () => {
  return new Promise((resolve, reject) => {
    const sql = `WITH date_range AS (
				SELECT generate_series(
						CURRENT_DATE - INTERVAL '6 days',
						CURRENT_DATE,
						INTERVAL '1 day'
				) AS date
		)
		SELECT
				d.date,
				TRIM(to_char(d.date, 'Day')) AS day_name,
				COALESCE(ROUND(AVG(hps.subtotal)::numeric), 0) AS average
		FROM
				date_range d
		LEFT JOIN
				history h ON DATE_TRUNC('day', h.updated_at) = d.date
		LEFT JOIN
				history_products_sizes hps ON h.id = hps.history_id
				AND h.updated_at  >= CURRENT_DATE - INTERVAL '6 days'
		LEFT JOIN
				status s ON h.status_id = s.id
		WHERE
				s.id <> 1 OR s.id IS NULL
		GROUP BY
				d.date,
				day_name
		ORDER BY
				d.date`;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getReports = (sortBy) => {
  return new Promise((resolve, reject) => {
    const setSql = (sortBy) => {
      if (sortBy === 'month') {
        return `SELECT TO_CHAR(dates.month, 'Mon') AS month,
                  COALESCE(SUM(subtotal), 0) AS monthly_total
                FROM (
                  SELECT DATE_TRUNC('month', CURRENT_DATE) - (interval '1 month' * generate_series(0, 5)) AS month
                ) AS dates
                LEFT JOIN history_products_sizes hps
                  ON hps.created_at::date >= dates.month
                  AND hps.created_at::date < dates.month + interval '1 month'
                  AND hps.status_id <> 1
                GROUP BY dates.month
                ORDER BY MIN(dates.month)`;
      }

      if (sortBy === 'week') {
        return `SELECT TO_CHAR(dates.week, 'YYYY-MM-DD') AS week,
                  COALESCE(SUM(subtotal), 0) AS weekly_total
                FROM (
                  SELECT DATE_TRUNC('week', CURRENT_DATE) - (interval '1 week' * generate_series(0, 5)) AS week
                ) AS dates
                LEFT JOIN history_products_sizes hps
                  ON hps.created_at::date >= dates.week
                  AND hps.created_at::date < dates.week + interval '1 week'
                  AND hps.status_id <> 1
                GROUP BY dates.week
                ORDER BY MIN(dates.week)`;
      }

      if (sortBy === 'day') {
        return `SELECT TO_CHAR(dates.day, 'Dy') AS day,
                  COALESCE(SUM(subtotal), 0) AS daily_total
                FROM (
                  SELECT CURRENT_DATE - generate_series(0, 6) AS day
                ) AS dates
                LEFT JOIN history_products_sizes hps
                  ON hps.created_at::date = dates.day
                  AND hps.status_id <> 1
                GROUP BY TO_CHAR(dates.day, 'Dy')
                ORDER BY MIN(dates.day)`;
      }
    };

    if (
      !sortBy ||
      (sortBy !== 'month' && sortBy !== 'week' && sortBy !== 'day')
    )
      sortBy = 'month';

    db.query(setSql(sortBy), (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getHistory,
  getHistoryDetail,
  getModifiedHistory,
  insertHistory,
  insertDetailHistory,
  updateHistory,
  checkHistory,
  deleteHistory,
  deleteAllDetailHistory,
  deleteDetailHistory,
  getPendingTransaction,
  updateTransactionStatus,
  updateTransactionStatusDetail,
  getMonthlyReport,
  getDailyTransactions,
  getReports,
};
