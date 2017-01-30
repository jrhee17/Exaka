class Image
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  include Mongoid::Timestamps::Updated
  belongs_to :owner, :class_name=>"User", :inverse_of=>:post_images
  mount_uploader :postImage, PostImageUploader
end
