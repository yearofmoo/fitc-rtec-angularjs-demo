Pusher.url = "http://41641b6578793d5cced1:cf407e4f7bd44b4a1d53@api.pusherapp.com/apps/58762"

class AppPusher 
  def self.send(channel, event, data)
    Pusher[channel].trigger(event, data)
  end
end
