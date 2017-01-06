class User
  include Mongoid::Document
  include ActiveModel::SecurePassword
  has_secure_password
  field :name, type: String
  field :email, type: String
  field :password_digest, type: String
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy

  # To add comment
  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end
end
