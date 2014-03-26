import sqlite3

conn = sqlite3.connect('db/turbobi.db')

cur = conn.cursor()

cur.execute('drop table if exists customers')
conn.commit()

cur.execute("CREATE TABLE customers (customer_id INTEGER, email TEXT, added_time NUMERIC, \
	referral_source TEXT, first_order_date NUMERIC, lifetime_revenue REAL, \
	lifetime_num_orders INTEGER, secs_between_first_order_and_created INTEGER, thirty_day_revenue REAL, \
	sixty_day_revenue REAL, ninty_day_revnue REAL, year_revenue REAL, \
	secs_since_created INTEGER, thirty_day_num_orders INTEGER, sixty_day_num_orders INTEGER, \
	lifetime_quantity INTEGER)")

conn.commit()

with open('rawdata/customers.csv') as f:

	'''skip the first line'''
	f.readline()
	for line in f:
		cur.execute("INSERT INTO customers VALUES (" + line + ")")
		conn.commit()

conn.close();