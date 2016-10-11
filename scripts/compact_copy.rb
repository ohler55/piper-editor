#!/usr/bin/env ruby -wW1
# encoding: UTF-8

def compact(src, dest)
  Dir.foreach(src) { |filename|
    src_path = File.join(src, filename)
    next unless File.readable?(src_path)
    next if filename.start_with?('.')
    dest_path = File.join(dest, filename)
    if filename.end_with?('.html')
      compact_html(src_path, dest_path)
    elsif filename.end_with?('.js')
      compact_js(src_path, dest_path)
    elsif filename.end_with?('.css')
      compact_css(src_path, dest_path)
    else
      `cp "#{src_path}" "#{dest_path}"`
    end
  }
end

def compact_js(src, dest)
  cnt = 0
  sf = File.new(src)
  df = File.open(dest, 'w')
  sf.each_line do |line|
    cnt += 1
    line.strip!
    # Remove comments from all but the two header lines.
    if 2 < cnt
      line = remove_js_comment(line)
      line = compact_js_line(line)
    end
    df.puts(line) unless 0 == line.length
  end
end

def remove_js_comment(line)
  quote = nil
  slash = 0
  i = 0
  line.each_char { |c|
    i += 1
    if quote.nil?
      if '"' == c || '\'' == c
        quote = c
      elsif '/' == c
        slash += 1
        if 2 <= slash
          return line[0,i - 2]
        end
      else
        slash = 0
      end
    else
      if c == quote
        quote = nil
      end
    end
  }
  line
end

$punc = '(){}[]/*-+=|&%^:;<>?,'

def compact_js_line(line)
  quote = nil
  space = false
  past_punc = false
  new_line = ''
  line.each_char { |c|
    if quote.nil?
      if '"' == c || '\'' == c
        quote = c
        past_punc = false
        new_line += c
      elsif ' ' == c || '\t' == c
        space = !past_punc
        past_punc = false
      else
        if $punc.include?(c)
          past_punc = true
          space = false
          # TBD if an alphanum then put in space if needed
          # if /+=-{()} then drop space
        else
          past_punc = false
          if space
            new_line += ' '
            space = false
          end
        end
        new_line += c
      end
    else
      if c == quote
        quote = nil
      end
      new_line += c
    end
  }
  new_line
end

def compact_html(src, dest)
  cnt = 0
  sf = File.new(src)
  df = File.open(dest, 'w')
  sf.each_line do |line|
    line.strip!
    df.puts(line) unless 0 == line.length
  end
end

def compact_css(src, dest)
  cnt = 0
  sf = File.new(src)
  df = File.open(dest, 'w')
  sf.each_line do |line|
    cnt += 1
    line.strip!
    # Remove comments from all but the two header lines.
    line = remove_css_comment(line) unless cnt <= 2
    df.puts(line) unless 0 == line.length
  end
end

def remove_css_comment(line)
  # TBD
  line
end


begin
  raise "Too few arguments." if ARGV.size < 1
  raise "Not enough arguments." if 2 < ARGV.size
  src = File.expand_path(ARGV[0])
  dest = File.expand_path(ARGV[1])
  `mkdir -p #{dest}`
  compact(src, dest)
rescue Exception => e
  puts "#{e.class}: #{e.message}"
  #e.backtrace.each { |line| puts line }
  puts %{Usage:
compact <source dir> <destination dir>

Copies and compacts files from a source to a destination directory.
  }
end
