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

  def pusher_create
    AppPusher.send('comment', 'create', self.to_json) unless @skip_pusher == true
    AppPusher.send('user/' + self.user_id.to_s + '/comments', 'create', self.to_json) unless @skip_pusher == true
  end

  def pusher_update
    AppPusher.send('comment', 'update', self.to_json) unless @skip_pusher == true
    AppPusher.send('user/' + self.user_id.to_s + '/comments', 'destroy', self.to_json) unless @skip_pusher == true
  end

  def pusher_destroy
    AppPusher.send('comment', 'destroy', self.to_json) unless @skip_pusher == true
    AppPusher.send('user/' + self.user_id.to_s + '/comments', 'update', self.to_json) unless @skip_pusher == true
  end

end
