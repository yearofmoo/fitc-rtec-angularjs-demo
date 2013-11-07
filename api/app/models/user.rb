class User < ActiveRecord::Base
  after_save :publish_to_pusher

  def publish_to_pusher
    AppPusher.send('user', self.to_json)
  end
end
