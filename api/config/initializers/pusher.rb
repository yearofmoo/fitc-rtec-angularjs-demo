Pusher.url = "http://8775f81254810188bcfd:f18712d506c9a0c3513e@api.pusherapp.com/apps/58761"

class AppPusher 
  def self.send(channel, event, data)
    Pusher[channel].trigger(event, data)
  end
end
