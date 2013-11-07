class User < ActiveRecord::Base
  has_many :comments
  has_one :featured_user

  scope :latest,
    order(:created_at => :desc)

  has_attached_file :avatar, :styles => {
      :large => "600x600>",
      :medium => "300x300>",
      :thumb => "100x100>"
    },
    :path => 'public/storage/:class/:attachment/:id_partition/:style_:filename',
    :url => 'http://localhost:3000/storage/:class/:attachment/:id_partition/:style_:filename',
    :default_url => "/images/:style/missing.png"

  after_create :pusher_create
  after_save :pusher_update
  after_destroy :pusher_destroy

  def skip_pusher(bool)
    @skip_pusher = bool
  end

  def pusher_create
    AppPusher.send('user', 'create', self.to_json) unless @skip_pusher == true
  end

  def pusher_update
    AppPusher.send('user', 'update', self.to_json)
    AppPusher.send('user/' + self.id.to_s, 'update', self.to_json) unless @skip_pusher == true
  end

  def pusher_destroy
    AppPusher.send('user', 'destroy', self.to_json) unless @skip_pusher == true
  end

  def featured?
    self.featured_user.exist?
  end
end
