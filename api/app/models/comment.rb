class Comment < ActiveRecord::Base

  scope :latest,
    order(:created_at => :desc)

  belongs_to :user
  belongs_to :visitor,
    :class_name => 'User'

  after_create :pusher_create
  after_save :pusher_update
  after_destroy :pusher_destroy

  def pusher_create
    AppPusher.send('comment', 'create', self.to_json)
    AppPusher.send('user/' + self.user_id.to_s + '/comments', 'create', self.to_json)
  end

  def pusher_update
    AppPusher.send('comment', 'update', self.to_json)
    AppPusher.send('user/' + self.user_id.to_s + '/comments', 'destroy', self.to_json)
  end

  def pusher_destroy
    AppPusher.send('comment', 'destroy', self.to_json)
    AppPusher.send('user/' + self.user_id.to_s + '/comments', 'update', self.to_json)
  end

end
