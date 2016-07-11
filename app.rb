
require 'webrick'
require 'curb'

def test_put ip="0.0.0.0"
  time_str = Time.now.utc.iso8601.to_s
  curl = Curl.put('search-test-am6bb6mpqcj7mrpf7dmdyvtn2q.us-west-2.es.amazonaws.com/test/ronen/'+Time.now.to_f.to_s.gsub(/\./,""),
                  '{"eventTime":"2016-07-11T18:29:28Z","@timestamp":"'+ time_str +'","desc":"ronen noga bka bla" ,"ip":"'+ip+'"}')
  curl.body_str
end

class Simple < WEBrick::HTTPServlet::AbstractServlet
  def do_GET request, response
    #status, content_type, body = do_stuff_with request
    puts 'this is req by query' , request.query
    response.status = 200
    response['Content-Type'] = 'text/plain'
    response.body = test_put request.remote_ip.to_s
  end
end

root = File.expand_path '.'
server = WEBrick::HTTPServer.new :Port => 8001, :DocumentRoot => root
trap 'INT' do server.shutdown end
server.mount '/simple', Simple
server.start


