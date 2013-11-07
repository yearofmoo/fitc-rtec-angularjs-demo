json.featured_users @featured do |featured|
  json.partial! 'api/v1/user', user: featured.user
end
