json.id user.id
json.first_name user.first_name
json.last_name user.last_name
json.email user.email
json.info user.info
json.age user.age
json.location user.location
json.avatar do
  json.original user.avatar.url(:original)
  json.medium user.avatar.url(:medium)
  json.thumb user.avatar.url(:thumb)
  json.large user.avatar.url(:large)
end
