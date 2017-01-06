class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :ensure_login
  helper_method :logged_in?, :current_user

  protected
    def ensure_login
        redirect_to login_path unless session[:user_id]
    end
    def logged_in?
        session[:user_id]
    end
    def current_user
		begin
			@current_user ||= User.find(session[:user_id])
        rescue Mongoid::Errors::DocumentNotFound
            session[:user_id] = nil
            redirect_to root_path
		end
    end
end
