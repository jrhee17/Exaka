class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?


  #def configure_permitted_parameters
  #  devise_parameter_sanitizer.permit(:sign_up, keys: [:username])
  #end
  def configure_permitted_parameters
    added_attrs = [:username, :email, :password, :password_confirmation, :remember_me]
    devise_parameter_sanitizer.permit :sign_up, keys: added_attrs
    devise_parameter_sanitizer.permit :account_update, keys: added_attrs
  end
#  before_action :ensure_login
#  helper_method :logged_in?, :current_user
#
#  protected
#    def ensure_login
#        if not session[:user_id]
#            session[:referer] = URI(request.referer).path unless !session[:referer]
#            redirect_to login_path
#        end
#    end
#    def referer_path
#        session[:referer] = root_path if !session[:referer] or [login_path, new_user_path].include?(session[:referer]) 
#        session[:referer]
#    end
#    def logged_in?
#        session[:user_id]
#    end
#    def current_user
#		begin
#			@current_user ||= User.find(session[:user_id]) unless not session[:user_id]
#        rescue Mongoid::Errors::DocumentNotFound
#            session[:user_id] = nil
#            redirect_to root_path
#		end
#    end
end
