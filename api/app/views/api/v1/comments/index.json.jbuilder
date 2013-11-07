json.comments @comments do |comment|
  json.visitor do
    json.partial! 'api/v1/user', user: comment.visitor
  end
  json.user do
    json.partial! 'api/v1/user', user: comment.user
  end
  json.id comment.id
  json.message comment.message
end
