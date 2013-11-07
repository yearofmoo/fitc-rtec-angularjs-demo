# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
#Admin.create({ :email => 'admin@admin.com', :password => 'admin123' })

### Create the users
User.destroy_all
user_avatars = Dir.glob("db/seed_users/pictures/*.jpg")
users_file = File.read('db/seed_users/users.json')
users = JSON.parse(users_file)

User.skip_callback(:create)
ser.skip_callback(:save)
i = 0
users.each do |user|
  u = User.new(user)
  u.avatar = File.open(user_avatars.sample)
  if u.save
    puts "#{i} user: #{u.id} created"
  else
    puts "#{i} user skipped"
  end

  i += 1
end

### Create the comments
Comment.destroy_all
comments_file = File.read('db/seed_comments/comments.json')
comments = JSON.parse(comments_file)

ids = User.pluck(:id).sort
min_id = ids.first
max_id = ids.last
r = Random.new
id_range = min_id..max_id

i = 0
comments.each do |comment|
  user_id = r.rand(id_range)
  visitor_id = user_id
  while user_id == visitor_id
    visitor_id = r.rand(id_range)
  end

  c = Comment.new({
    :message => comment['message'],
    :user_id => user_id,
    :visitor_id => visitor_id
  })

  if c.save
    puts "#{i} comment: #{c.id} created"
  else
    puts "#{i} comment skipped"
  end

  i += 1
end
