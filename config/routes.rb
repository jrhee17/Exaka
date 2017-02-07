Rails.application.routes.draw do
#  devise_for :users
#  get '/login' => "sessions#new", as: "login"
#  get '/auth_req' => "sessions#auth_req", as: "auth_req"
#  delete '/logout'=> "sessions#destroy", as: "logout"

   devise_for :users, controllers: {
     sessions: 'users/sessions'
   }
#  resource :sessions, only: [:new, :create, :destroy]

  resources :users do
  end
  resources :posts do
      resources :comments
      post 'upvote_comment/:id', to: 'comments#upvote', as: 'upvote_comment'
  end

  get 'posts', to: 'posts#main'
  post 'posts/autosave', to: 'posts#autosave', as: 'autosave_post'

  post 'upvote_post/:id', to: 'posts#upvote', as: 'upvote_post'
  post 'posts/upload_image', to: 'upload_image#post', as: 'upload_image_post'
  get 'image/:id', to: 'upload_image#get_image', as: 'get_image_post'
  get 'thumb/:id', to: 'upload_image#get_thumb_image', as: 'get_image_post_thumb'


  root 'posts#main'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
