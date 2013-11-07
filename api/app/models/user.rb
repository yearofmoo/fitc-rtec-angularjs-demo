class User < ActiveRecord::Base
  has_many :comments

  has_attached_file :avatar, :styles => {
      :medium => "300x300>",
      :thumb => "100x100>"
    },
    :path => 'public/storage/:class/:attachment/:id_partition/:filename',
    :url => 'http://localhost:3000/storage/:class/:attachment/:id_partition/:filename',
    :default_url => "/images/:style/missing.png"

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
