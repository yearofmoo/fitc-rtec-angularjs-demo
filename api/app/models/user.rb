class User < ActiveRecord::Base
  has_many :comments

  after_save :publish_to_pusher
  after_destroy :publish_all_to_pusher

  def publish_to_pusher
    AppPusher.send('user', self.to_json)
    publish_all_to_pusher
  end

  def publish_all_to_pusher
    AppPusher.send('users', User.scoped.to_json)
  end
end
