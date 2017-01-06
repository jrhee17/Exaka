class SessionsController < ApplicationController
  
  skip_before_action :ensure_login, only: [:new, :create]

  def new
  end

  def create
      user = User.where(name: params[:user][:name]).first
      password = params[:user][:password]

      p 'sessions create: ', user
      if user && user.authenticate(password)
          p 'authenticated'
          session[:user_id] = user.id
          redirect_to root_path, notice: "Logged in successfully"
      else
          p 'not authenticated'
          redirect_to login_path, alert: "Invalid username/password combination"
      end
  end

  def destroy
      reset_session
      redirect_to root_path, notice: "You have been logged out"
  end
end
