Rails.application.routes.draw do
  get '/login' => "sessions#new", as: "login"
  delete '/logout'=> "sessions#destroy", as: "logout"

  resource :sessions, only: [:new, :create, :destroy]

  resources :users do
      resources :posts
  end

  get 'posts', to: 'posts#main'

  root 'posts#main'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
