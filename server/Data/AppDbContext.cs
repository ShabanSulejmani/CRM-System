using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        
        public DbSet<UserForm> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);



            modelBuilder.Entity<UserForm>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(50);
                
                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(100);
                    
                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasDefaultValue("user");

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
                    

            });
        }
    }
}