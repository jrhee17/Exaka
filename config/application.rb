require_relative 'boot'

#require 'rails/all'

require "rails"
require "action_cable"
require "active_record"
require "active_support/version"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

%w(
  mongoid
  action_controller
  action_mailer
  active_resource
  rails/test_unit
).each do |framework|
  begin
    require "#{framework}/railtie"
  rescue LoadError
  end
end



module Exaka
  class Application < Rails::Application
     #Mongoid.load!(File.expand_path('mongoid.yml', './config'))
     Mongoid.load!("./config/mongoid.yml")
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
  end
end
