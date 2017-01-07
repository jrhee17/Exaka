class User
  attr_accessor :password_confirmation

  include Mongoid::Document
  include ActiveModel::SecurePassword
  include Mongoid::Timestamps::Created
  include Mongoid::Timestamps::Updated
  has_secure_password
  field :name, type: String
  field :email, type: String
  field :password_digest, type: String
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy

  validates :name, :email, :password, :presence=> true
  validates :name, uniqueness: true, length: {:in=> 6..20}
  validates :email, uniqueness: true, email_format: { message: "doesn't look like an email address" }
  validates_confirmation_of :password

  PASSWORD_FORMAT = /\A
    (?=.{8,})          # Must contain 8 or more characters
    (?=.*\d)           # Must contain a digit
    (?=.*[a-z])        # Must contain a lower case character
    (?=.*[A-Z])        # Must contain an upper case character
    (?=.*[[:^alnum:]]) # Must contain a symbol
  /x
  
  validates :password, 
    presence: true, 
    length: {in: 6..20 }, 
    format: {with: PASSWORD_FORMAT}, 
    confirmation: true, 
    on: :create 

  # To add comment
  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end
end
