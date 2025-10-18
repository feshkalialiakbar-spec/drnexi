#!/bin/bash

# Daily Backup Script for Production Logs
# این اسکریپت هر روز فایل‌های CSV لاگ را به مقصد مشخص کپی می‌کند

# تنظیمات اصلی - این مقادیر را بر اساس پروژه خود تغییر دهید
LOG_DIR="/home/user/my-next-app/logs"
BACKUP_DIR="/var/backups/production-logs"
ARCHIVE_DIR="/var/backups/production-logs/archives"
RETENTION_DAYS=30

# ایجاد دایرکتوری‌های مورد نیاز
mkdir -p "$BACKUP_DIR"
mkdir -p "$ARCHIVE_DIR"

# فایل لاگ برای خود اسکریپت
BACKUP_LOG="$LOG_DIR/backup.log"

# تابع لاگ کردن
log_backup() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$BACKUP_LOG"
}

# تابع ایجاد backup
create_daily_backup() {
    local today=$(date '+%Y-%m-%d')
    local backup_folder="$BACKUP_DIR/$today"
    local archive_file="$ARCHIVE_DIR/production-logs-${today}.tar.gz"
    
    log_backup "Starting daily backup for $today"
    
    # ایجاد فولدر backup امروز
    mkdir -p "$backup_folder"
    
    # شمارش فایل‌های CSV موجود
    local csv_count=$(find "$LOG_DIR" -name "*.csv" -type f | wc -l)
    log_backup "Found $csv_count CSV files to backup"
    
    if [ "$csv_count" -gt 0 ]; then
        # کپی کردن تمام فایل‌های CSV
        find "$LOG_DIR" -name "*.csv" -type f -exec cp {} "$backup_folder/" \;
        
        # ایجاد آرشیو فشرده
        cd "$LOG_DIR"
        tar -czf "$archive_file" --exclude="backup.log" .
        
        # محاسبه حجم فایل‌ها
        local backup_size=$(du -sh "$backup_folder" | cut -f1)
        local archive_size=$(du -sh "$archive_file" | cut -f1)
        
        log_backup "Backup completed successfully"
        log_backup "Backup folder size: $backup_size"
        log_backup "Archive size: $archive_size"
        log_backup "Files copied to: $backup_folder"
        log_backup "Archive created at: $archive_file"
    else
        log_backup "No CSV files found to backup"
    fi
}

# تابع پاک کردن فایل‌های قدیمی
cleanup_old_backups() {
    log_backup "Cleaning up backups older than $RETENTION_DAYS days"
    
    # پاک کردن فولدرهای backup قدیمی
    find "$BACKUP_DIR" -maxdepth 1 -type d -name "20*" -mtime +$RETENTION_DAYS -exec rm -rf {} \;
    
    # پاک کردن آرشیوهای قدیمی
    find "$ARCHIVE_DIR" -name "production-logs-*.tar.gz" -mtime +$RETENTION_DAYS -delete
    
    log_backup "Cleanup completed"
}

# تابع نمایش آمار
show_backup_stats() {
    local total_backups=$(find "$BACKUP_DIR" -maxdepth 1 -type d -name "20*" | wc -l)
    local total_archives=$(find "$ARCHIVE_DIR" -name "production-logs-*.tar.gz" | wc -l)
    local total_size=$(du -sh "$BACKUP_DIR" | cut -f1)
    
    log_backup "=== Backup Statistics ==="
    log_backup "Total backup folders: $total_backups"
    log_backup "Total archives: $total_archives"
    log_backup "Total backup size: $total_size"
    log_backup "========================"
}

# اجرای اصلی
main() {
    log_backup "=== Daily Backup Script Started ==="
    
    # بررسی وجود دایرکتوری لاگ
    if [ ! -d "$LOG_DIR" ]; then
        log_backup "ERROR: Log directory $LOG_DIR does not exist!"
        exit 1
    fi
    
    # ایجاد backup
    create_daily_backup
    
    # پاک کردن فایل‌های قدیمی
    cleanup_old_backups
    
    # نمایش آمار
    show_backup_stats
    
    log_backup "=== Daily Backup Script Completed ==="
}

# اجرای اسکریپت
main "$@"
