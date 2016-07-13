
require 'webrick'



def test_put ip="0.0.0.0"
  time_str = Time.now.utc.iso8601.to_s
  port = 80
  host = 'search-test-am6bb6mpqcj7mrpf7dmdyvtn2q.us-west-2.es.amazonaws.com'
  path = '/test/ronen/'+Time.now.to_f.to_s.gsub(/\./,"")+"/"

  req = Net::HTTP::Put.new(path, initheader = { 'Content-Type' => 'text/plain'})
  req.body = '{"eventTime":"2016-07-11T18:29:28Z","@timestamp":"'+ time_str +'","desc":"ronen noga bka bla" ,"ip":"'+ip+'"}'
  response = Net::HTTP.new(host, port).start {|http| http.request(req) }
  response.to_s

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


require 'net/http'



root = File.expand_path '.'
server = WEBrick::HTTPServer.new :Port => 80, :DocumentRoot => root
trap 'INT' do server.shutdown end
server.mount '/simple', Simple
server.start


