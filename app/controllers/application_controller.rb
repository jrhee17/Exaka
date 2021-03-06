class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :check_for_mobile
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

  def check_for_mobile
    session[:mobile_override] = params[:mobile] if params[:mobile]
    prepare_for_mobile if mobile_device?
  end

  def mobile_device?
    if session[:mobile_override]
      session[:mobile_override] == "1"
    else
      (request.user_agent =~ /Mobile|webOS/) && (request.user_agent !~ /iPad/)
    end
  end

  def prepare_for_mobile
    request.format = :mobile if mobile_device?
  end

  helper_method :mobile_device?

end
