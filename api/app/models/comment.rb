class Comment < ActiveRecord::Base

  scope :latest,
    order(:created_at => :desc)

  belongs_to :user
  belongs_to :visitor,
    :class_name => 'User'

  after_save :publish_to_pusher
  after_destroy :publish_all_to_pusher

  def self.find_user_comments(user_id)
    Comment.where(:user_id => user_id)
  end

  def publish_to_pusher
    AppPusher.send('users/' + self.user_id.to_s + '/comments', Comment.find_user_comments(self.user_id).to_json)
    publish_all_to_pusher
  end

  def publish_all_to_pusher
    AppPusher.send('comments', Comment.scoped.to_json)
  end

end
