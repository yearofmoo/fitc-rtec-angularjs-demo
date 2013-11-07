AngularRailsApp::Application.routes.draw do

  #
  # Admin Area
  #
  devise_for :admins
  mount RailsAdmin::Engine => '/admin', :as => 'rails_admin'

  #
  # API Area
  #
  namespace :api, defaults: {format: 'json'}  do
    namespace :v1 do
      resource :users, :only => [:show]
    end
  end

  #
  # Catch other routes
  #
  root :to => 'home#index'
  get '/' => 'home#index', :as => :home
  get '*path' => 'home#index'

end
