# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

users = []
5.times do |user_index|
    user = User.new({:username=>'asdfasdf' + user_index.to_s, :email=>'email' + user_index.to_s + '@asdf.asdf', :password=>'Password123!@#', :password_confirmation=>'Password123!@#'});
    user.skip_confirmation!
    user.save!
    users.push(user);
end 

posts = []
users.each do |user|
    10.times do |post_index|
        post = Post.create!({:title=>user.username + '-title' + post_index.to_s + 'trailing string', :body=>'bbodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodybodyody', :owner=>user});
        posts.push(post)
    end
end


comments = []
users.each do |user|
    posts.each do |post|
        10.times do |comment_index|
            comment = Comment.create!({:text=>post.title + '-comment' + comment_index.to_s, :post=>post, :owner=>user});
            comments.push(comment)
        end
    end
end


