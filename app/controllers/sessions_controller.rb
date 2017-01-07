class SessionsController < ApplicationController
  
  skip_before_action :ensure_login, only: [:new, :create]

  def new
  end

  def auth_req
  end

  def create
      user = User.where(name: params[:user][:name]).first
      password = params[:user][:password]

      if user && user.authenticate(password)
          session[:user_id] = user.id
          redirect_to referer_path, notice: "Logged in successfully"
      else
          redirect_to login_path, alert: "Invalid username/password combination"
      end
  end

  def destroy
      reset_session
      redirect_to root_path, notice: "You have been logged out"
  end
end
