class Comment < ActiveRecord::Base

  scope :latest,
    order(:created_at => :desc)

  belongs_to :user
  belongs_to :visitor,
    :class_name => 'User'

  after_create :pusher_create
  after_save :pusher_update
  after_destroy :pusher_destroy

  def skip_pusher(bool)
    @skip_pusher = bool
  end

  def to_listing_json
    listing = {
      :id => self.id,
      :created_at => self.created_at,
      :updated_at => self.updated_at,
      :message => self.message,
      :user => self.user.serializable_hash(:methods => :picture),
      :visitor => self.visitor.serializable_hash(:methods => :picture)
    }.to_json
  end

  def pusher_create
    AppPusher.send('comment', 'create', self.to_listing_json) unless @skip_pusher == true
    AppPusher.send('user/' + self.user_id.to_s + '/comments', 'create', self.to_listing_json) unless @skip_pusher == true
  end

  def pusher_update
    AppPusher.send('comment', 'update', self.to_listing_json) unless @skip_pusher == true
    AppPusher.send('user/' + self.user_id.to_s + '/comments', 'destroy', self.to_listing_json) unless @skip_pusher == true
  end

  def pusher_destroy
    AppPusher.send('comment', 'destroy', self.to_listing_json) unless @skip_pusher == true
    AppPusher.send('user/' + self.user_id.to_s + '/comments', 'update', self.to_listing_json) unless @skip_pusher == true
  end

end
