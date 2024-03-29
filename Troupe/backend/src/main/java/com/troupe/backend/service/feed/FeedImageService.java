package com.troupe.backend.service.feed;

import com.troupe.backend.domain.feed.Feed;
import com.troupe.backend.domain.feed.FeedImage;
import com.troupe.backend.repository.feed.FeedImageRepository;
import com.troupe.backend.util.S3FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class FeedImageService {
    private final FeedImageRepository feedImageRepository;

    private final S3FileUploadService s3FileUploadService;

    public void insert(List<FeedImage> feedImageList){
//        System.out.println("feedImageListsize:  "+ feedImageList.size());
        try {
            // 피드 이미지들 저장
            for(FeedImage image: feedImageList){
//                System.out.println("feedImage:  "+ image.getImageUrl());
                feedImageRepository.save(image);
            }
        }catch (Exception e){
            log.info(e.toString());
        }
    }

    public void delete(List<Integer> feedImageList){
        try{
            // 피드 이미지들 DB 삭제
            for(Integer imageNo : feedImageList){
//                System.out.println("delete imageNo : "+imageNo);
                // delete access denied 뜸..
                s3FileUploadService.deleteFile(feedImageRepository.findById(imageNo).get().getImageUrl());
                feedImageRepository.delete(feedImageRepository.findById(imageNo).get());
            }
        }catch (Exception e){
            log.info(e.toString());
        }
    }

    public List<FeedImage> selectAll(Feed feed){
        List<FeedImage> list =  feedImageRepository.findAllByFeedOrderByImageNo(feed);
        return list;
    }
}
