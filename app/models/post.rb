class Post
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  include Mongoid::Timestamps::Updated
  field :title, type: String
  field :body, type: String
  belongs_to :user
  has_many :comments, dependent: :destroy

  validates :title, :body, :user, :presence=> true
  validates :title, length: {:in => 15..150 }
  validates :body, length: {:in => 30..30000 }

  def self.search(search, page)
      p 'self.search'
      result = self.where(title: /#{search}/i).order_by(:created_at=>-1).paginate(:per_page => 10, :page => page)
      p 'result', result
      return result
  end
end

