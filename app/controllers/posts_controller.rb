class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy, :upvote]

  skip_before_action :authenticate_user!, only: [:index, :main, :show]


  # GET /posts
  # GET /posts.json
  def index
      p 'index params', params
    @posts = Post.search(params[:search], params[:page])
  end

  def main
    @posts = Post.where(:draft=>false).order_by(:created_at=>-1).limit(20)
  end

  # GET /posts/1
  # GET /posts/1.json
  def show
    @comment = Comment.new
  end

  # GET /posts/new
  def new
    exists = Post.where({:draft => true, :owner => current_user}).exists?
    if exists then
        @post = Post.where({:draft => true, :owner => current_user}).first
    else
        @post = Post.new(:owner => current_user)
        @post.save(validate: false)
    end
  end

  # GET /posts/1/edit
  def edit
  end

  def autosave
    draft = Post.where({:draft => true, :owner => current_user}).first
    draft.title = params[:title] if params[:title]
    draft.body = params[:body] if params[:body]
    draft.save(validate: false)
  end

  # GET /posts/1/edit
  def upvote
    if @post.voted_users.include? current_user then
      @post.voted_users.delete(current_user)
      current_user.voted_posts.delete(@post)
    else
      @post.voted_users.push(current_user)
      current_user.voted_posts.push(@post)
    end
    @post.save
    current_user.save
    redirect_to :back
  end

  # POST /posts
  # POST /posts.json
  def create
    @user = current_user
    @post = Post.new(post_params)
    @post.owner = @user
    @post.draft = false;

    respond_to do |format|
      if @post.save
        format.html { redirect_to post_path(@post), notice: 'Post was successfully created.' }
        format.mobile { redirect_to post_path(@post), notice: 'Post was successfully created.' }
        format.json { render :show, status: :created, location: user_path(@user) }
      else
        format.html { render :new }
        format.mobile { render :new }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json
  def update
    @post.owner = current_user
    respond_to do |format|
      if @post.update(post_params)
        @post.draft = false
        @post.save
        format.html { redirect_to post_path(@post), notice: 'Post was successfully updated.' }
        format.mobile { redirect_to post_path(@post), notice: 'Post was successfully updated.' }
        format.json { render :show, status: :ok, location: @post }
      else
        format.html { render :edit }
        format.mobile { render :edit }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.json
  def destroy
    @post.destroy
    respond_to do |format|
      format.html { redirect_to root_path, notice: 'Post was successfully destroyed.' }
      format.mobile { redirect_to root_path, notice: 'Post was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def post_params
      params.require(:post).permit(:title, :body, :user)
    end
end
