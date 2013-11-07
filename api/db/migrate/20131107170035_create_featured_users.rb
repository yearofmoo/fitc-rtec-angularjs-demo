class CreateFeaturedUsers < ActiveRecord::Migration
  def change
    create_table :featured_users do |t|
      t.integer :user_id
      t.timestamps
    end
  end
end
