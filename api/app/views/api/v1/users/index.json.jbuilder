json.users @users do |user|
  json.partial! 'api/v1/user', user: user
end
