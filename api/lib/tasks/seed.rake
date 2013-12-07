namespace :seed do

  namespace :comments do
    task :add => [:environment] do
      ids = User.pluck(:id).sort
      min_id = ids.first
      max_id = ids.last
      r = Random.new
      id_range = min_id..max_id

      comments_file = File.read('db/seed_comments/comments.json')
      comments = JSON.parse(comments_file)
      for i in 0..4 do
        comment = comments.sample

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
      end
    end

    task :remove => [:environment] do
      Comment.latest.limit(5).destroy_all
    end
  end

end
