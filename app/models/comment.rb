class Comment
  include Mongoid::Document
  field :user, type: User
  field :text, type: String
  field :post, type: Post
  field :createDate, type: Date
  field :updateDate, type: Date
  belongs_to :post
  belongs_to :user
end
