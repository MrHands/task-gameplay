import os
import datetime
import subprocess

today = datetime.date.today()

print('Number of commits in the last 7 days:')

for i in range(0, 7):
	print('')

	when = today - datetime.timedelta(days=i)

	with subprocess.Popen('git rev-list --count --since="{}" --before="{}" --all --no-merges'.format(when.strftime('%Y-%m-%d 00:00'), when.strftime('%Y-%m-%d 23:59')), shell=True, stdout=subprocess.PIPE) as proc:
		result = int(proc.stdout.readline().rstrip().decode('utf-8'))

		bar = ''
		for x in range(max(result, 12)):
			if x < result:
				bar += '#'
			else:
				bar += ' '

		print('{} [ {} ] {}'.format(when.strftime('%Y-%m-%d'), bar, result))