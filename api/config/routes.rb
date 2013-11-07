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
      resources :users, :only => [:index, :show] do
        resources :comments, :only => [:index]
      end
      resources :comments, :only => [:index]
      resources :featured_users, :only => [:index]
    end
  end

  #
  # Catch other routes
  #
  root :to => 'home#index'
  get '/' => 'home#index', :as => :home

end
