json.users @users do |user|
  json.first_name user.first_name
  json.last_name user.last_name
  json.email user.email
  json.info user.info
  json.age user.age
  json.location user.location
end
