class Post
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  include Mongoid::Timestamps::Updated
  field :title, type: String
  field :body, type: String
  belongs_to :user
  has_many :comments, dependent: :destroy
end
