
echo Copying html to mobile view...
echo ------------------------------

application_regex='.*application.html.erb'
regex='*.html.erb'
find ./app/views -name "*.html.erb" -print | while read f; do
  html_file=$f

  if [[ $f =~ ^.*layouts/.*.html.erb$ ]]; then
    echo Skipping files in layout : $f
    continue
  fi

  if [[ $f =~ ^.*mailer/.*.html.erb$ ]]; then
    echo Skipping files with mailer : $f
    continue
  fi

  if [[ $f =~ ^(.*).html.erb$ ]]; then
    file_name=${BASH_REMATCH[1]}
    mobile_template=".mobile.erb"
    if [ ! -f $file_name$mobile_template ]; then
      echo File "$file_name$mobile_template" not found! Copying from existing html file...
      cp $f $file_name$mobile_template
      echo Copy for "$file_name$mobile_template" not found! Copying from existing html file...
    fi
  else
    echo File "$f" in wrong format
  fi
done
