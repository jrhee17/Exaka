class Comment
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  include Mongoid::Timestamps::Updated
  field :text, type: String
  field :post, type: Post
  belongs_to :post
  belongs_to :owner, :class_name=>"User", :inverse_of=>:voted_comments

  has_and_belongs_to_many :voted_users, :class_name=>"User", :inverse_of=>:voted_comments

  validates :owner, :post, :text, presence: true
  validates :text, length: { in: 15..1024 }
end
