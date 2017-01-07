Rails.application.routes.draw do
  get '/login' => "sessions#new", as: "login"
  get '/auth_req' => "sessions#auth_req", as: "auth_req"
  delete '/logout'=> "sessions#destroy", as: "logout"

  resource :sessions, only: [:new, :create, :destroy]

  resources :users do
  end
  resources :posts do
      resources :comments
  end

  get 'posts', to: 'posts#main'

  root 'posts#main'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
