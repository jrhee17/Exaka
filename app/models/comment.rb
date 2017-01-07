class Comment
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  include Mongoid::Timestamps::Updated
  field :user, type: User
  field :text, type: String
  field :post, type: Post
  belongs_to :post
  belongs_to :user

  validates_associated :post
  validates_associated :user
end
